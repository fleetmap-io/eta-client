import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { CaptureConsole } from '@sentry/integrations'

export default () => {
  Sentry.init({
    Vue,
    dsn: 'https://a85dc49a9ef34c93b23c663a3db5b35a@o321784.ingest.sentry.io/6741286',
    integrations: [
      new CaptureConsole({ levels: ['error'] })
    ]
  })
}
