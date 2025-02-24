type NotionTitle = {
  text: {
    content: string;
  };
};

type NotionProperties = {
  実施予定日: {
    date: { start: string };
  };
  完了: {
    checkbox: boolean;
  };
  タイトル?: {
    title: NotionTitle[];
  };
};

type NotionTask = {
  id: string;
  properties: NotionProperties;
};

export type FetchTodayTasksResult = NotionTask[];