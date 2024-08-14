import axios from "axios";

export interface CreateTransactionRequest {
  merchantAuthentication: {
    name: string;
    transactionKey: string;
  };
  transactionRequest: {
    transactionType: string;
    amount: string;
    payment: {
      creditCard: {
        cardNumber: string;
        expirationDate: string;
        cardCode: string;
      };
    };
  };
}

export interface TransactionRequest {
  createTransactionRequest: CreateTransactionRequest;
}

export interface TransactionResponse {
  responseCode: string;
  authCode: string;
  avsResultCode: string;
  cvvResultCode: string;
  cavvResultCode: string;
  transId: string;
  refTransID: string;
  transHash: string;
  testRequest: string;
  accountNumber: string;
  accountType: string;
  messages: [
    {
      code: string;
      description: string;
    }
  ];
  transHashSha2: string;
  SupplementalDataQualificationIndicator: number;
  networkTransId: string;
}

export interface TransactionMessages {
  resultCode: string;
  message: [
    {
      code: string;
      text: string;
    }
  ];
}

export interface TransactionResponseData {
  transactionResponse: TransactionResponse;
  messages: TransactionMessages;
}

export const captureAndCharge = async ({
  authorizeNetApiLoginId,
  authorizeNetApiTransactionKey,
  amount,
  cardNumber,
  expDate,
  cardCode,
}: {
  authorizeNetApiLoginId: string;
  authorizeNetApiTransactionKey: string;
  amount: string;
  cardNumber: string;
  expDate: string;
  cardCode: string;
}): Promise<TransactionResponseData> => {
  const payload: TransactionRequest = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: authorizeNetApiLoginId,
        transactionKey: authorizeNetApiTransactionKey,
      },
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: amount,
        payment: {
          creditCard: {
            cardNumber: cardNumber,
            expirationDate: expDate,
            cardCode: cardCode,
          },
        },
      },
    },
  };

  try {
    const response = await axios.post("https://apitest.authorize.net/xml/v1/request.api", payload);
    console.log("Authorize.net Response:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error capturing and charging catf:", error);
    throw error;
  }
};
