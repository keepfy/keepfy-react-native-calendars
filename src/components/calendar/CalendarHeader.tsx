import { T } from 'ramda'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { material } from 'react-native-typography'
import { IconButton } from 'react-native-paper'
import format, { DateFormats } from '../../lib/format'

type Props = {
    monthDate: Date
    onArrowPress: (index: number) => void
    index: number
}

const styles = StyleSheet.create({
    monthNameContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    monthNameText: {
        ...material.body2Object,
        textAlign: 'center',
        flex: 1,
        marginVertical: 4
    }
})

const CalendarHeader = React.memo((props: Props) => {
    const {
        monthDate,
        index,
        onArrowPress
    } = props
    const monthName = format(monthDate, DateFormats.MONTH_OF_YEAR)

    const handlePress = useCallback((index: number) => () => {
        onArrowPress(index)
    }, [onArrowPress])

    /*
     * Icons will probably not work
     * we still need to let the dev choose
     * them (as well as customizing this lib).
     * We will probably use a context provider for this.
     */
    return (
        <View style={ styles.monthNameContainer }>
            <IconButton
                onPress={ handlePress(index - 1) }
                icon='chevron-left'
            />
            <Text style={ styles.monthNameText }>
                { monthName }
            </Text>
            <IconButton
                onPress={ handlePress(index + 1) }
                icon='chevron-right'
            />
        </View>
    )
}, T)

export default CalendarHeader
