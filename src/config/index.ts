import fs from 'fs';
import toml from 'toml';

// TOML 파일 읽기
const configFile = fs.readFileSync('config.toml', 'utf-8');
const parsedConfig = toml.parse(configFile);

// 설정 인터페이스 정의
interface Config {
  server: {
    mode: string;
    port: number;
    authRedirectUrl: string;
  };
  accountDB: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  contentDB: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
    user: string;
    password: string;
    connect: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  log: {
    path: string;
    level: string;
    botToken: string;
    chatId: string;
  };
}

// 설정 객체 생성
const config: Config = {
  server: parsedConfig.server,
  accountDB: parsedConfig.accountDB,
  contentDB: parsedConfig.contentDB,
  redis: parsedConfig.redis,
  jwt: parsedConfig.jwt,
  log: parsedConfig.log,
};

export default config;
