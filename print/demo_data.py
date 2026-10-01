#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tek kaynaktan sayı üretimi (düzeltme belgesi R027/R031/R040): dijital demo kodu, basılı şekil üreticileri ve
"Adım adım" tabloları bu sayıları kullanır. Çalıştır: python3 print/demo_data.py → print/kitap/qa/demo-data.json + ekrana özet.
  4.3 geri yayılım: gerçek eğitim (2 girdi → 2 gizli sigmoid → 1 çıktı sigmoid, L = ½(ŷ−y)², sabit başlangıç ağırlıkları, η sabit)
  4.5 RNN: h_t = tanh(W_x x_t + W_h h_{t−1}), h₀ = 0, 5 kelime (one-hot), 4 gizli birim, sabit küçük ağırlıklar
  5.4 sıcaklık: z = ln p; softmax(z/T); açgözlü (argmax) ve T = 1,5 örneklemesi sabit tohumlu düzgün sayılarla (ters-CDF)"""
import json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sig = lambda z: 1 / (1 + math.exp(-z))

# ---- 4.3 geri yayılım (gerçek gradyan inişi) ----
X = [1.0, 0.5]; Y = 0.8; LR = 2.0
W1 = [[0.3, -0.2], [0.4, 0.1]]; B1 = [0.0, 0.0]; W2 = [0.5, -0.3]; B2 = 0.0
rounds = []
w1 = [r[:] for r in W1]; b1 = B1[:]; w2 = W2[:]; b2 = B2
for r in range(0, 9):
    z1 = [sum(w1[i][j] * X[j] for j in range(2)) + b1[i] for i in range(2)]
    h = [sig(z) for z in z1]
    z2 = sum(w2[i] * h[i] for i in range(2)) + b2
    yhat = sig(z2)
    L = 0.5 * (yhat - Y) ** 2
    d2 = (yhat - Y) * yhat * (1 - yhat)             # ∂L/∂z2
    g_w2 = [d2 * h[i] for i in range(2)]; g_b2 = d2
    d1 = [d2 * w2[i] * h[i] * (1 - h[i]) for i in range(2)]
    g_w1 = [[d1[i] * X[j] for j in range(2)] for i in range(2)]; g_b1 = d1[:]
    rounds.append({'tur': r, 'yhat': round(yhat, 4), 'hata': round(Y - yhat, 4), 'kayip': round(L, 5),
                   'h': [round(v, 4) for v in h], 'w2': [round(v, 4) for v in w2], 'b2': round(b2, 4),
                   'w1': [[round(v, 4) for v in row] for row in w1], 'grad_w2': [round(v, 5) for v in g_w2], 'grad_z2': round(d2, 5)})
    # güncelle (bir sonraki tur için)
    w2 = [w2[i] - LR * g_w2[i] for i in range(2)]; b2 -= LR * g_b2
    w1 = [[w1[i][j] - LR * g_w1[i][j] for j in range(2)] for i in range(2)]; b1 = [b1[i] - LR * g_b1[i] for i in range(2)]
bp = {'girdi': X, 'hedef': Y, 'lr': LR, 'W1_0': W1, 'b1_0': B1, 'W2_0': W2, 'b2_0': B2, 'turlar': rounds}

# ---- 4.5 RNN ----
WORDS_TR = ['Kedi', 'kaçtı', 'çünkü', 'o', 'korkmuştu']; WORDS_EN = ['The', 'cat', 'ran', 'because', 'it', 'was', 'scared']
# 5 kelimelik TR cümle temel; EN 7 kelime → aynı W_x sütunları döngüsel kullanılır (kelime k → sütun k mod 5)
WX = [[0.9, -0.4, 0.3, -0.7, 0.5], [-0.6, 0.8, -0.2, 0.4, -0.9], [0.2, -0.5, 0.7, 0.6, -0.3], [-0.8, 0.3, -0.6, 0.9, 0.1]]
WH = [[0.5, -0.3, 0.2, 0.0], [0.1, 0.4, -0.5, 0.3], [-0.2, 0.6, 0.3, -0.4], [0.3, -0.1, 0.4, 0.5]]
def rnn(words):
    h = [0.0] * 4; out = [{'adim': 0, 'kelime': None, 'h': [0.0] * 4}]
    for t, w in enumerate(words):
        k = t % 5
        hn = [math.tanh(WX[i][k] + sum(WH[i][j] * h[j] for j in range(4))) for i in range(4)]
        h = hn; out.append({'adim': t + 1, 'kelime': w, 'h': [round(v, 2) for v in h]})
    return out
rnnd = {'Wx': WX, 'Wh': WH, 'h0': [0, 0, 0, 0], 'tr': rnn(WORDS_TR), 'en': rnn(WORDS_EN)}

# ---- 5.4 sıcaklık ----
U = [0.37, 0.81, 0.12, 0.64, 0.49, 0.93, 0.26, 0.58]  # sabit tohum: ters-CDF örneklemesi
def temp_rows(steps, T):
    """steps: her adımda [(kelime, p), …] (p mevcut demo olasılıkları). Döner: her adım için softmax(z/T) ve seçim."""
    rows = []
    for si, cands in enumerate(steps):
        z = [math.log(max(p, 1e-6)) for _, p in cands]
        m = max(z); e = [math.exp((zz - m) / T) for zz in z]; s = sum(e); q = [v / s for v in e]
        if T == 0: pick = max(range(len(q)), key=lambda i: q[i])
        else:
            u = U[si % len(U)]; acc = 0; pick = len(q) - 1
            for i, v in enumerate(q):
                acc += v
                if u < acc: pick = i; break
        rows.append({'olasiliklar': [round(v, 2) for v in q], 'secim': cands[pick][0], 'secim_idx': pick})
    return rows
temp = {'U': U, 'T_ornekleme': 1.5, 'not': 'Açgözlü satır argmax; örnekleme satırı softmax(z/1.5) + U ile ters-CDF. z = ln p (mevcut demo olasılıkları).'}

out = {'bp43': bp, 'rnn45': rnnd, 'temp54': temp}
os.makedirs(os.path.join(ROOT, 'print', 'kitap', 'qa'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'print', 'kitap', 'qa', 'demo-data.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('4.3 geri yayılım (η=%.1f):' % LR, ' · '.join(f"t{r['tur']}: ŷ={r['yhat']} L={r['kayip']}" for r in rounds))
print('4.5 RNN TR:', [(o['kelime'], o['h']) for o in rnnd['tr']])
print('4.5 RNN EN:', [(o['kelime'], o['h']) for o in rnnd['en']])
print('5.4 örnek: steps=[[("çok",.42),("hızlı",.38),("artık",.20)]] T=1.5 →', temp_rows([[('çok', .42), ('hızlı', .38), ('artık', .20)]], 1.5))
