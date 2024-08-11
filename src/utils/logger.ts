import winston from 'winston';
import TransportStream from 'winston-transport';
import cfg from '../config';
import 'winston-daily-rotate-file';
import TelegramBot from 'node-telegram-bot-api';

// 텔레그램 봇 초기화
const bot = new TelegramBot(cfg.log.botToken, { polling: false });

interface TelegramTransportOptions extends TransportStream.TransportStreamOptions {
  telegramConfig?: {
    botToken: string;
    chatId: string;
  };
}

// 커스텀 텔레그램 트랜스포트 생성
class TelegramTransport extends TransportStream {
  private telegramConfig?: {
    botToken: string;
    chatId: string;
  };

  constructor(opts: TelegramTransportOptions) {
    super(opts);
    this.telegramConfig = opts.telegramConfig;
  }

  log(info: winston.LogEntry, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (info.level === 'error' && this.telegramConfig) {
      const message = `Error: ${info.message}\n\nStack: ${info.stack || 'No stack trace'}`;
      
      // 비동기적으로 텔레그램 메시지 전송
      setImmediate(() => {
        bot.sendMessage(this.telegramConfig!.chatId, message)
          .catch(err => {
            console.error('Failed to send Telegram message:', err);
            // 여기에 추가적인 에러 처리 로직을 넣을 수 있습니다.
          });
      });
    }

    // 즉시 콜백 호출
    callback();
  }
}

const logger = winston.createLogger({
  level: cfg.log.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: `${cfg.log.path}_${cfg.server.mode}_%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '14d'
    }),
    new TelegramTransport({
      level: 'error',
      telegramConfig: {
        botToken: cfg.log.botToken,
        chatId: cfg.log.chatId
      }
    })
  ]
});

export default logger;