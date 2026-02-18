import { EventSchemas, Inngest } from 'inngest';

type Events = {
  'analyse-request': {
    data: {
      domain: string;
      email: string;
    };
  };
};

export const inngest = new Inngest({
  id: 'opensight',
  schemas: new EventSchemas().fromRecord<Events>(),
});
