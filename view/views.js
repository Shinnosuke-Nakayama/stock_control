const { translate } = require("@vitalets/google-translate-api");
const { getTrump } = require("../getTruth");
const fs = require("fs");
const path = require("path");
const { resolve } = require("dns");
const createResponseBody = () => {
  const responseTrump = async (req, res) => {
    console.log("アクセス");
    let result = [];
    try {
      const data = await getTrump();
      const translatedData = [];
      for (const post of data) {
        if (post.content && post.content.trim() !== "") {
          try {
            const resTranslate = await translate(post.content, {
              from: "en",
              to: "ja",
            });
            post.content_ja = resTranslate.text;
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (transError) {
            console.error("翻訳エラー:", transError.message);
            post.content_ja = "(翻訳失敗)";
          }
        } else {
          post.content_ja = "(本文なし)";
        }
        console.log("データ取得完了");
        translatedData.push(post);
      }
      await translatedData.forEach((post) => {
        result.push({
          post_date: post.account.last_status_at,
          post_user: post.account.username,
          contents: post.content_ja,
        });
      });
      console.log(result);
      const filePath = await path.join(__dirname, "trump_posts.json");
      const jsonFile = await JSON.stringify(result, null, 2);
      await fs.writeFileSync(filePath, jsonFile, "utf-8");
      console.log("ファイルを保存しました。", `${filePath}`);
      res.status(200).json({ successe: true, data: result });
      return;
    } catch (error) {
      console.error("取得失敗", error);
      res.status(500).json({ successe: false, error: error.message });
      return;
    }
  };
  return {
    responseTrump,
  };
};

module.exports = { createResponseBody };
