import { useSelector } from 'react-redux'
import { createUseStyles, useTheme } from 'react-jss'
import * as R from 'ramda'

import { Text } from '~/react-native-dummies'

const useStyles = createUseStyles({
  frameDiagnostic: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontFamily: 'VT323-Regular',
    color: R.path(['theme', 'debugColor']),
  },
})

export default () => {
  const tickIdle = useSelector(R.path(['tick', 'idle']))
  const tickMode = useSelector(R.path(['tick', 'mode']))
  const skewDiagnostic = useSelector(R.path(['tick', 'skewDiagnostic']))
  const gameClock = useSelector(R.path(['game', 'clock']))

  const theme = useTheme()
  const styles = useStyles({ theme })

  const diagnostic = ((sd, cd) => `${sd} ${cd}`)(
    R.defaultTo('', skewDiagnostic),
    tickIdle || tickMode !== 'game' ? '' : ` ${gameClock}`,
  )

  return <Text className={styles.frameDiagnostic}>{diagnostic}</Text>
}
