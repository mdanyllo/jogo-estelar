export const config = {
  port: Number(process.env.PORT) || 3333,
  timeZone: process.env.TIME_ZONE || 'America/Sao_Paulo',
  wordLength: 5,
  maxAttempts: 6
}
