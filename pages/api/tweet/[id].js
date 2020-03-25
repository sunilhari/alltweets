const axios = require("axios");
const querystring = require("querystring");

const config = {
 consumer_key: "5PXzHkBuatXVnqpLKeQOLeO5o",
 consumer_secret: "6yO8a6Ixuzajq38cLTTnMek90mA6KLr5u1CPMpn3iJqPuZq1XM",
 access_token: "1590717055-QiBuK8RCZ9lDklRotAfGPLrQWZW0czgBwBjLpUz",
 access_token_secret: "IzZX8zSbkwAc6kbQvFLoyQawfFA6ps0bOe4EnkITS1Vi1",
 timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
 strictSSL: true // optional - requires SSL certificates to be valid.
};

async function getToken() {
 try {
  const str = `${config.consumer_key}:${config.consumer_secret}`;
  const bearerToken = Buffer.from(str).toString("base64");
  const { data } = await axios({
   url: "https://api.twitter.com/oauth2/token",
   method: "POST",
   headers: {
    Authorization: `Basic ${bearerToken}`,
    "Content-Type": "application/x-www-form-urlencoded"
   },
   data: querystring.stringify({
    grant_type: "client_credentials"
   })
  });
  console.log(data);
  return data.access_token;
 } catch (error) {
  return undefined;
 }
}
async function getTweet(id, token) {
 const queryString = querystring.stringify({
  ids: id,
  expansions:
   "attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id",
  "tweet.fields":
   "attachments,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,source,public_metrics,text,withheld"
 });
 try {
  const { data } = await axios({
   url: `https://api.twitter.com/2/timeline/conversation/${id}`,
   headers: {
    Authorization: `Bearer ${token}`
   }
  });
  return data;
 } catch (error) {
  console.log(error);
  return undefined;
 }
}
export default async (req, res) => {
 const {
  query: { id }
 } = req;
 try {
  const token = await getToken();
  const tweet = await getTweet(id, token);
  console.log(tweet);
  res.end(JSON.stringify(tweet));
 } catch (error) {
  res.statusCode = 500;
  res.end(JSON.stringify({ error }));
 }

 res.statusCode = 200;
};
/*
const { data: tweet } = await T.get("statuses/show/:id", {
   id,
   include_entities: true,
   include_ext_alt_text: true,
   tweet_mode: "extended",
   trim_user: false
  });
  const {
   user: { screen_name },
   id_str: twitterId
  } = tweet;
  const { data: replies } = await T.get("search/tweets", {
   q: encodeURIComponent(`from:${screen_name}`),
   count: 100,
   since_id: id,
   include_entities: true,
   in_reply_to_status_id: id
  });
  const statuses =
   replies.statuses; 

   res.statusCode = 200;
   res.end(
    JSON.stringify({
     tweet,
     statuses,
     length: statuses.length
    })
   );*/
