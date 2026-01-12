import dialogflow from "@google-cloud/dialogflow";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessionClient = new dialogflow.SessionsClient({
      credentials: {
        client_email: process.env.DF_CLIENT_EMAIL,
        private_key: process.env.DF_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.DF_PROJECT_ID,
      "session-espoch"
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body?.message || "",
          languageCode: "es",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;

    return res.status(200).json({ reply: result });

  } catch (error) {
    console.error("Dialogflow error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
