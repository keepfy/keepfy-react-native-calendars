import React, { useCallback } from 'react'
import {
    StyleProp,
    StyleSheet,
    Text, TextStyle,
    TouchableOpacity
} from 'react-native'
import { material } from 'react-native-typography'
import { EventEmitter } from 'fbemitter'
import { getDate } from 'date-fns'
import DefaultColors from '../../lib/colors'

export type DayProps = {
    isHidden?: boolean
    textStyle?: StyleProp<TextStyle>
    markedAsCurrent?: boolean
    markedAsSelected?: boolean
    formatter?: (date: Date) => string
    day: Date
    /*
     * And emitter is used here
     * to avoid re-renders when handlers are changed
     * FIXME: this creates the problem of the 'disabled' click
     *  listeners not behaving correctly
     */
    emitter?: EventEmitter<'onLongPress' | 'onPress'>
}

export const DAY_DIMENS = 32

const styles = StyleSheet.create({
    container: {
        width: DAY_DIMENS,
        height: DAY_DIMENS,
        alignItems: 'center',
        justifyContent: 'center'
    },
    markedCurrent: {
        borderRadius: DAY_DIMENS,
        backgroundColor: DefaultColors.markedCurrentDay
    },
    selectedDay: {
        color: DefaultColors.markedCurrentDay
    }
})

const Day = React.memo((props: DayProps) => {
    const {
        emitter,
        isHidden,
        day
    } = props
    const dayLabel = props.formatter
        ? props.formatter(day)
        : getDate(day)

    const handleOnPress = useCallback(() => {
        if(emitter) {
            emitter.emit('onPress', day)
        }
    }, [day, emitter])

    const handleOnLongPress = useCallback(() => {
        if(emitter) {
            emitter.emit('onLongPress', day)
        }
    }, [emitter, day])

    const isMarked = !isHidden && props.markedAsCurrent
    const isSelected = !isHidden && props.markedAsSelected

    return (
        <TouchableOpacity
            style={ [
                styles.container,
                isSelected
                    ? styles.markedCurrent
                    : null
            ] }
            onPress={
                emitter
                    ? handleOnPress
                    : undefined
            }
            onLongPress={
                emitter
                    ? handleOnLongPress
                    : undefined
            }>
            <Text
                allowFontScaling={ false }
                style={ [
                    isSelected
                        ? material.captionWhite
                        : material.caption,
                    isMarked && !isSelected
                        ? styles.selectedDay
                        : {},
                    StyleSheet.flatten(props.textStyle)
                ] }>
                { isHidden ? '' : dayLabel }
            </Text>
        </TouchableOpacity>
    )
})

export default Day
