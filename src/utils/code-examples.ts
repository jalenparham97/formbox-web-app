export const htmlExampleCode = (
  url: string,
) => `<!-- modify this form HTML and place wherever you want your form -->
<form
  id="form"
  action="${url}"
  method="POST"
>
  <label>
    Your email: <!-- use this to reply to respondants -->
    <input type="email" name="email">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <!-- your other form fields go here -->
  <button type="submit">Send</button>
</form>`;

export const fetchExampleCode = (url: string) => `<script>
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch("${url}", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
        } else {
          console.log("fail");
        }
      })
      .catch((error) => console.log(error));
  });
</script>`;

export const axiosExampleCode = (
  url: string,
) => `<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
  const form = document.getElementById("form");
  form.addEventListener("submit", () => {
    e.preventDefault();
    const formData = new FormData(form);
    axios
      .post("${url}", formData)
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
        } else {
          console.log("fail");
        }
      })
      .catch((error) => console.log(error));
  });
</script>
`;

export const inlineEmbedCode = (url: string) => `<iframe 
  src="${url}" 
  loading="lazy" 
  width="100%" 
  height="700" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0"
/>
`;

export const fullPageEmbedCode = (url: string) => `<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
    <title>Contact form</title>
    <style type="text/css">
      html {
        margin: 0;
        height: 100%;
        overflow: hidden;
      }
      iframe {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 0;
      }
    </style>
  </head>
  <body>
    <iframe
      src="${url}"
      loading="lazy"
      width="100%"
      height="100%"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
    ></iframe>
  </body>
</html>
`;
