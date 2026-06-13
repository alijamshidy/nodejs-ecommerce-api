const ENDPOINT =
  "http://127.0.0.1:7381/ingest/ad08549f-5067-4bd1-9d13-dfe640a28f5e";
const DOCKER_ENDPOINT =
  "http://host.docker.internal:7381/ingest/ad08549f-5067-4bd1-9d13-dfe640a28f5e";

module.exports.debugLog = (data) => {
  const body = JSON.stringify({
    sessionId: "859ebc",
    timestamp: Date.now(),
    ...data,
  });
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "859ebc",
    },
    body,
  };
  fetch(DOCKER_ENDPOINT, opts).catch(() =>
    fetch(ENDPOINT, opts).catch(() => {}),
  );
};
