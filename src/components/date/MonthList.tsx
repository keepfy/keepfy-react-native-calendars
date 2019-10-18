import React, { useCallback, useMemo, useState } from 'react'
import {
    Dimensions,
    FlatList,
    ListRenderItemInfo,
    StyleSheet,
    Text,
    View,
    ViewToken
} from 'react-native'
import Month, { MonthProps } from './Month'
import { addMonths, startOfMonth, subMonths } from 'date-fns'
import { material } from 'react-native-typography'
import format, { DateFormats } from '../../lib/format'
import { times } from 'ramda'

export type MonthListProps = Pick<
    MonthProps,
    | 'currentDay'
    | 'selectedDay'
    | 'showExtraDates'
    | 'emitter'
> & {
    initialDate?: Date
    minPastMonths?: number
    maxFutureMonths?: number
    onVisibleMonthChange?: (date: Date) => void
}

const styles = StyleSheet.create({
    monthContainer: {},
    monthNameContainer: {
        alignItems: 'center'
    },
    monthNameText: {
        ...material.subheadingObject,
        marginVertical: 4,
        textTransform: 'capitalize'
    }
})

// FIXME: should useDimensions hook to handle screen rotation!
const screen = Dimensions.get('screen')

const MonthList = (props: MonthListProps) => {
    const {
        minPastMonths = 12,
        maxFutureMonths = 12,
        onVisibleMonthChange
    } = props
    const [initial] = useState(
        () => startOfMonth(props.initialDate || new Date()))
    const [past] = useState(
        () => subMonths(initial, minPastMonths))

    const renderMonth = useCallback(({ item }: ListRenderItemInfo<Date>) => {
        const monthName = format(item, DateFormats.MONTH_NAME_AND_YEAR)

        return (
            <View
                style={ styles.monthContainer }>
                <View style={ styles.monthNameContainer }>
                    <Text style={ styles.monthNameText }>
                        { monthName }
                    </Text>
                </View>
                <Month
                    width={ screen.width }
                    showExtraDates={ props.showExtraDates }
                    currentDay={ props.currentDay }
                    selectedDay={ props.selectedDay }
                    monthDate={ item }
                    emitter={ props.emitter }
                />
            </View>
        )
    }, [
        props.emitter,
        props.selectedDay,
        props.currentDay,
        props.showExtraDates
    ])

    // Could we use a pull-stream here?
    const range = useMemo(() => times(
        index => addMonths(past, index),
        minPastMonths + maxFutureMonths
    ), [maxFutureMonths, minPastMonths, past])

    const getItemDimensions = useCallback((_: Date[] | null, index: number) => ({
        index: index,
        length: screen.width,
        offset: index * screen.width
    }), [])

    const onViewableItemsChanged = useCallback(({
        viewableItems
    }: { viewableItems: Array<ViewToken> }) => {
        if(!viewableItems || !viewableItems[0]) {
            return
        }

        const { item } = (viewableItems[0] as unknown as { item: Date })
        if(onVisibleMonthChange) {
            onVisibleMonthChange(item)
        }
    }, [onVisibleMonthChange])

    return (
        <FlatList
            horizontal
            pagingEnabled
            viewabilityConfig={ {
                itemVisiblePercentThreshold: 40
            } }
            initialNumToRender={ 4 }
            maxToRenderPerBatch={ 4 }
            onViewableItemsChanged={ onViewableItemsChanged }
            initialScrollIndex={ minPastMonths }
            data={ range }
            renderItem={ renderMonth }
            getItemLayout={ getItemDimensions }
            showsHorizontalScrollIndicator={ false }
        />
    )
}

export default MonthList
