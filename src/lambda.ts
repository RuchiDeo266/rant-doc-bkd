import app from "./app";
import createServer from "@codegenie/serverless-express";

let serverlessHandler: any = null;

const initialize = () => {
  if (!serverlessHandler) {
    serverlessHandler = createServer({
      app,
    });
  }
  return serverlessHandler;
};

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const handlerFn = initialize();
    return await handlerFn(event, context);
  } catch (error: any) {
    console.error("❌ Lambda Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};

// Local fallback
if (!process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 3500;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}
