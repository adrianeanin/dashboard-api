const app = require("./app");
const config = require("./utils/config");

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
