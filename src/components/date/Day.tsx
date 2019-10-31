import React, { useCallback } from 'react'
import {
    StyleProp,
    StyleSheet,
    Text, TextStyle,
    TouchableOpacity,
    View
} from 'react-native'
import { material } from 'react-native-typography'
import { EventEmitter } from 'fbemitter'
import { getDate } from 'date-fns'
import DefaultColors from '../../lib/colors'
import { T } from 'ramda'

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
const SELECTED_EXTRA_RADIUS = 2

const styles = StyleSheet.create({
    contentContainer: {
        height: DAY_DIMENS,
        width: DAY_DIMENS,
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
        width: DAY_DIMENS,
        height: DAY_DIMENS
    },
    dayText: material.captionObject,
    selectedMark: {
        borderRadius: DAY_DIMENS + SELECTED_EXTRA_RADIUS,
        backgroundColor: DefaultColors.markedCurrentDay,
        position: 'absolute',
        padding: (DAY_DIMENS / 2) + SELECTED_EXTRA_RADIUS
    }
})

// Oh, hi mark
const Mark = React.memo(() => <View style={ styles.selectedMark } />, T)

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

    const isMarkedAsToday = !isHidden && props.markedAsCurrent
    const isSelected = !isHidden && props.markedAsSelected

    const renderMark = useCallback(() => {
        if(!isSelected) {
            return null
        }

        return <Mark />
    }, [isSelected])

    return (
        <View style={ styles.container }>
            { renderMark() }
            <TouchableOpacity
                style={ styles.contentContainer }
                onPress={
                    !isHidden && emitter
                        ? handleOnPress
                        : undefined
                }
                onLongPress={
                    !isHidden && emitter
                        ? handleOnLongPress
                        : undefined
                }>
                <Text
                    allowFontScaling={ false }
                    style={ [
                        styles.dayText,
                        {
                            color: isSelected
                                ? DefaultColors.selectedDayTextColor
                                : isMarkedAsToday
                                    ? DefaultColors.todayTextColor
                                    : DefaultColors.dayTextColor
                        },
                        StyleSheet.flatten(props.textStyle)
                    ] }>
                    { isHidden ? '' : dayLabel }
                </Text>
            </TouchableOpacity>
        </View>
    )
})

export default Day

