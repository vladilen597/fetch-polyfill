async function customFetch(url, ...arg) {
  let xhr = new XMLHttpRequest();
  let xhrCallback;
  let errorCallback;
  let toSend;

  let method = "GET";
  if (arg.length == 0) {
    xhr.open(method, url, true);
    xhr.responseType = "json";
  } else {
    if (arg[0].method == "GET" || arg[0].method == "POST") {
      method = arg[0].method;
      xhr.open(method, url, true);
      xhr.responseType = "json";
    }
    if (arg[0].method == "PUT" || arg[0].method == "PATCH") {
      method = arg[0].method;
      let headersKey = Object.keys(arg[0].headers);
      let headersValue = Object.values(arg[0].headers);
      xhr.open(method, url, true);
      xhr.setRequestHeader(headersKey[0], headersValue[0]);
      toSend = JSON.stringify(arg[0].body);
      xhr.responseType = "json";
    }
  }

  xhr.send(toSend);
  xhr.onreadystatechange = function () {
    let data = this;
    if (xhr.readyState === 4 && xhr.status === 200) {
      xhrCallback(data);
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      errorCallback(data);
    }
  };

  return {
    then: function then(callback) {
      xhrCallback = callback;
      errorCallback = callback;
    },
    catch: function customCatch(callback) {
      errorCallback = callback;
    },
  };
}

customFetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "PUT",
  body: {
    id: 1,
    body: "bar",
    userId: 1,
  },
  headers: { "Content-Type": "application/json" },
}).then((a) => {
  console.log(a);
});

customFetch("https://jsonplaceholder.typicode.com/posts/1").then((a) => {
  console.log(a);
});
