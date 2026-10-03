async function enableRealtime() {
  try {
    if (!window.MIZARI_API) {
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://cdn.socket.io/4.8.1/socket.io.min.js";

    script.onload = () => {
      try {
        if (typeof io === "undefined") {
          return;
        }

        const apiUrl =
          window.MIZARI_API.replace(/\/api$/, "");

        window.mizariSocket = io(apiUrl, {
          auth: {
            token: API.token()
          }
        });

        window.mizariSocket.on(
          "ride:update",
          () => {
            if (typeof load === "function") {
              load();
            }
          }
        );

      } catch (e) {
        console.error("Realtime error:", e);
      }
    };

    script.onerror = () => {
      console.warn("Socket.IO بارگذاری نشد.");
    };

    document.head.appendChild(script);

  } catch (e) {
    console.error("Realtime error:", e);
  }
}


function vapidKey(value) {
  const padding =
    "=".repeat((4 - value.length % 4) % 4);

  const base64 =
    (value + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const raw = atob(base64);

  return Uint8Array.from(
    [...raw].map(char => char.charCodeAt(0))
  );
}


async function enablePush() {
  try {
    if (!window.MIZARI_API) {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (!("PushManager" in window)) {
      return;
    }

    const result =
      await API.call("/push/public-key");

    if (!result || !result.enabled || !result.publicKey) {
      return;
    }

    const registration =
      await navigator.serviceWorker.ready;

    let subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            vapidKey(result.publicKey)
        });
    }

    await API.call("/push/subscribe", {
      method: "POST",
      body: JSON.stringify({
        subscription:
          subscription.toJSON()
      })
    });

  } catch (e) {
    console.warn("Push notification unavailable:", e);
  }
}
