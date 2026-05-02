const API = API_BASE;

async function post(url, data, token = null) {
  const res = await fetch(API + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {})
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

async function get(url, token = null) {
  const res = await fetch(API + url, {
    headers: {
      ...(token ? { Authorization: "Bearer " + token } : {})
    }
  });

  return res.json();
}