import dialogflow from "@google-cloud/dialogflow";

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: process.env.DF_CLIENT_EMAIL,
    private_key: process.env.DF_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

export default async function handler(req, res) {
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DF_PROJECT_ID,
    "session-espoch"
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode: "es",
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult.fulfillmentText;

  res.status(200).json({ reply: result });
}
