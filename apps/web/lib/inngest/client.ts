import { EventSchemas, Inngest } from "inngest";

type Events = {
  "report/request": {
    data: {
      reportId: string;
      domain: string;
      email: string;
    };
  };
};

export const inngest = new Inngest({
  id: "opensight",
  schemas: new EventSchemas().fromRecord<Events>(),
});
