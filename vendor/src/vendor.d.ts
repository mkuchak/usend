type DnsQuery = {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question?: QuestionEntity[] | null;
  Answer?: AnswerEntity[] | null;
};

type QuestionEntity = {
  name: string;
  type: number;
};

type AnswerEntity = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

type Dictionary = { [key: string]: string };
