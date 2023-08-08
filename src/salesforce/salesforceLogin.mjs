import axios from "axios";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "dev/legalbrave/api";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT",
    })
  );
} catch (error) {
  throw error;
}

const secrets = JSON.parse(response.SecretString);

const salesforceLogin = async () => {
  console.log("Starting salesforce login process...");

  let salesforceAccessToken, salesforceInstanceUrl;

  try {
    const authParams = new URLSearchParams({
      grant_type: secrets.SALESFORCE_GRANT_TYPE,
      client_id: secrets.SALESFORCE_CLIENT_ID,
      client_secret: secrets.SALESFORCE_CLIENT_SECRET,
      username: secrets.SALESFORCE_USERNAME,
      password: secrets.SALESFORCE_PASSWORD,
    });

    const response = await axios.post(
      `${secrets.SALESFORCE_URL}services/oauth2/token`,
      authParams,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    ({
      salesforceAccessToken: salesforceAccessToken,
      salesforceInstanceUrl: salesforceInstanceUrl,
    } = response.data);

    console.log("Salesforce login process finished successfully: ");
  } catch (error) {
    console.error("Error at getting Salesforce login:", error);
    throw new Error("Error at getting Salesforce login: " + error);
  }

  return {
    salesforceAccessToken,
    salesforceInstanceUrl,
  };
};

export default salesforceLogin;
