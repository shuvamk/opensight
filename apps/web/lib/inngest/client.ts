import { EventSchemas, Inngest } from "inngest";

type Events = {
  "analyse-request": {
    data: {
      domain: string;
      email: string;
      requestId: string;
    };
  };
  "analysis/completed": {
    data: {
      domain: string;
      email: string;
      requestId: string;
      analysisResult: Record<string, unknown>;
    };
  };
};

export const inngest = new Inngest({
  id: "opensight",
  schemas: new EventSchemas().fromRecord<Events>(),
});
