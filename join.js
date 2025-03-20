import { useEffect, useState, useRef } from "react";
import { GIF } from "gif.js.optimized";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    import("@line/liff").then((liff) => {
      liff.init({ liffId: "2007093499-v0y7nZZA" }).then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile().then((profile) => {
            setUserId(profile.userId);
            setDisplayName(profile.displayName);
          });
        } else {
          liff.login();
        }
      });
    });
  }, []);

  const generateAmidakuji = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 400, height = 300;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const gif = new GIF({ workers: 2, quality: 10 });
    
    // あみだくじ線の描画
    const drawAmidakuji = (step) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;

      // 縦線
      for (let i = 0; i < 4; i++) {
        let x = 50 + i * 100;
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, height - 50);
        ctx.stroke();
      }

      // 横線
      for (let i = 0; i < step; i++) {
        let x1 = 50 + (Math.random() * 3 | 0) * 100;
        let x2 = x1 + 100;
        let y = 50 + Math.random() * (height - 100);
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    };

    // GIFのフレームを追加
    for (let i = 1; i <= 5; i++) {
      drawAmidakuji(i);
      gif.addFrame(ctx, { copy: true, delay: 500 });
    }

    // GIFを生成
    gif.on("finished", (blob) => {
      setGifUrl(URL.createObjectURL(blob));
    });

    gif.render();
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl">🎯 あみだくじ抽選 🎯</h1>
      {displayName ? <p>ようこそ, {displayName} さん</p> : <p>ログイン中...</p>}
      <button
        className="bg-blue-500 text-white p-2 rounded mt-4"
        onClick={generateAmidakuji}
      >
        あみだくじを引く
      </button>
      <canvas ref={canvasRef} className="mt-4 border"></canvas>
      {gifUrl && (
        <div>
          <img src={gifUrl} alt="あみだくじ結果" className="mt-4" />
          <p>長押しで保存し、オープンチャットに投稿してください！</p>
        </div>
      )}
    </div>
  );
}
