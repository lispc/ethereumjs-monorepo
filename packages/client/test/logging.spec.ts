import { isTruthy } from '@ethereumjs/util'
import * as tape from 'tape'
import { getLogger } from '../lib/logging'

tape('[Logging]', (t) => {
  const logger = getLogger()
  const format = logger.transports.find((t: any) => t.name === 'console')!.format!

  t.test('should log error stacks properly', (st) => {
    try {
      throw new Error('an error')
    } catch (e: any) {
      e.level = 'error'
      st.ok(
        /an error\n {4}at/.test((format.transform(e) as any).message),
        'log message should contain stack trace (1)'
      )
      st.ok(
        /an error\n {4}at/.test((format.transform({ level: 'error', message: e }) as any).message),
        'log message should contain stack trace (2)'
      )
      st.end()
    }
  })

  t.test('should colorize key=value pairs', (st) => {
    if (isTruthy(process.env.GITHUB_ACTION)) {
      st.skip('no color functionality in ci')
      return st.end()
    }
    const { message } = format.transform({
      level: 'info',
      message: 'test key=value',
    }) as any
    st.equal(
      message,
      'test \x1B[38;2;0;128;0mkey\x1B[39m=value ',
      'key=value pairs should be colorized'
    )
    st.end()
  })
})
