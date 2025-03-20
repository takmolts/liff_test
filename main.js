import { useEffect, useState } from "react";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState(null);

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

  const handleEntry = async () => {
    await fetch("https://your-server.com/entry", {
      method: "POST",
      body: JSON.stringify({ userId, displayName }),
      headers: { "Content-Type": "application/json" },
    });
    alert("抽選に応募しました！");
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl">LINE抽選システム</h1>
      {displayName ? <p>ようこそ, {displayName} さん</p> : <p>ログイン中...</p>}
      <button
        className="bg-blue-500 text-white p-2 rounded mt-4"
        onClick={handleEntry}
      >
        抽選に応募する
      </button>
    </div>
  );
}

