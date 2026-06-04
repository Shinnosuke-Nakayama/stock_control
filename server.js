const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { getTrump } = require("./getTruth");
const { translate } = require("@vitalets/google-translate-api");
const { createResponseBody } = require("./view/views");
const { getPhotos, uploadPhoto, s3GetSignedUrl } = require("./util/index");
const { responseTrump } = createResponseBody();
const knex = require("./knex");
const STOCK_DATA = "stock";
const NEWS_DATA = "news";
const multer = require("multer");
const upload = multer();

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.get("/toranpu", (req, res) => {
  responseTrump(req, res);
});

app.get("/stock_dates", async (req, res) => {
  const id = req.query["user_id"];
  try {
    const result = await knex(STOCK_DATA).where("id", id);
    res.status(200).json(result);
    return;
  } catch (error) {
    return;
  }
});

app.post("/photos", upload.any(), async (req, res) => {
  const id = req.body.user_id;
  const file_name = req.files[0].originalname;
  const create_data = {
    user_id: id,
    photo_name: file_name,
  };
  try {
    const result = await knex(STOCK_DATA).insert(create_data, ["*"]);
    const data = await uploadPhoto(
      req.files[0].buffer,
      req.files[0].originalname,
    );
    res.status(200).json({ successe: true, data: data, result: result });
    return;
  } catch (error) {
    console.error(error);
    return;
  }
});

app.get("/photos", async (req, res) => {
  const id = req.query["user_id"];
  try {
    const data = await knex(STOCK_DATA)
      .select("photo_name", "create_date", "id")
      .where("user_id", id);
    const result = await Promise.all(
      data.map(async (photo) => {
        console.log("photo", photo);
        const url = await s3GetSignedUrl(photo.photo_name);
        const res_object = {
          url: url,
          create_date: photo.create_date,
          id: photo.id,
        };
        return res_object;
      }),
    );
    res.status(200).json({ successe: true, data: result });
    return;
  } catch (error) {
    res.status(500).json({ successe: false, data: "写真取得失敗" });
    return;
  }
});

app.post("/update_photos", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await knex(STOCK_DATA)
      .where("id", id)
      .update({ create_date: knex.fn.now() }, ["*"]);
    res.status(200).json({ success: true, data: result });
    console.log(result);
    return;
  } catch (error) {
    console.log("時刻登録失敗", error);
    res.status(500).json({ successe: false, data: "時刻登録失敗" });
    return;
  }
});

app.delete("/delete", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await knex(STOCK_DATA).where("id", id).del(["*"]);
    res.status(200).json({ success: true, data: result });
    return;
  } catch (error) {
    console.log("削除失敗", error);
    res.status(500).json({ successe: false, data: "削除失敗" });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
