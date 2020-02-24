import {
    SectionList,
    SectionListData,
    SectionListProps,
    StyleSheet,
    Text,
    View
} from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { material } from 'react-native-typography'
import {
    getDate,
    isSameDay,
    isToday
} from 'date-fns'
import format, { DateFormats } from '../../lib/format'
import DefaultColors from '../../lib/colors'

export type SectionData<T> =
    & SectionListData<T>
    & { title: Date }

export type AgendaListProps<T> = Pick<SectionListProps<T>,
    | 'renderItem'
    | 'onScroll'
    | 'onMomentumScrollBegin'
    | 'onMomentumScrollEnd'
    | 'onEndReached'
    | 'keyExtractor'> & {
    nestedScrollEnabled?: boolean
    sections: SectionData<T>[]
    itemHeight: number
    initialDayDate: Date
}

const styles = StyleSheet.create({
    sectionHeader: {
        width: 50,
        height: 50,
        marginTop: 18,
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionTodayName: {
        ...material.captionObject,
        color: DefaultColors.markedCurrentDay,
        textTransform: 'uppercase'
    },
    sectionTodayNumber: {
        ...material.body1Object,
        backgroundColor: DefaultColors.today,
        color: DefaultColors.selectedDayTextColor,
        width: 35,
        height: 35,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 100
    },
    sectionText: {
        ...material.captionObject,
        textTransform: 'uppercase'
    }
})

function AgendaList<T>(props: AgendaListProps<T>) {
    const initialIndex = useMemo(
        () => {
            const { sections } = props
            const sectionIndex = sections.findIndex(section => isSameDay(
                (section as SectionData<T>).title,
                props.initialDayDate
            ))

            if (sectionIndex >= 0) {
                return sections
                    .slice(0, sectionIndex + 1)
                    .reduce((acc, value) => acc + value.data.length, 0)
            }

            return -1
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

    const getItemLayout = useCallback((_: unknown, index) => ({
        length: props.itemHeight,
        offset: props.itemHeight * index,
        index
    }), [props.itemHeight])

    const renderSectionHeader = (
        info: { section: SectionListData<T> }
    ) => {
        const section = info.section as SectionData<T>
        const today = isToday(section.title)
        const day = getDate(section.title)
        const dayOfWeek = format(section.title, DateFormats.MONTH_WEEK_SHORT)

        return (
            <View style={ styles.sectionHeader }>
                <Text style={ today
                    ? styles.sectionTodayName
                    : styles.sectionText
                }>
                    { dayOfWeek }
                </Text>
                <Text style={ today
                    ? styles.sectionTodayNumber
                    : styles.sectionText
                }>
                    { day }
                </Text>
            </View>
        )
    }

    return (
        <SectionList
            stickySectionHeadersEnabled
            nestedScrollEnabled={ props.nestedScrollEnabled }
            sections={ props.sections }
            renderItem={ props.renderItem }
            keyExtractor={ props.keyExtractor }
            showsVerticalScrollIndicator={ false }
            renderSectionHeader={ renderSectionHeader }
            onEndReached={ props.onEndReached }
            initialScrollIndex={
                initialIndex < 0
                    ? undefined
                    : initialIndex
            }
            getItemLayout={ getItemLayout }
        />
    )
}

export default AgendaList
