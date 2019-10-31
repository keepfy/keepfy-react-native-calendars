import {
    SectionList,
    SectionListData,
    SectionListProps,
    StyleSheet,
    Text,
    View
} from 'react-native'
import React from 'react'
import { material } from 'react-native-typography'
import {
    getDay,
    isToday
} from 'date-fns'
import format, { DateFormats } from '../../lib/format'
import DefaultColors from '../../lib/colors'

export type AgendaListProps<T> = Pick<
    SectionListProps<T>,
    | 'renderItem'
    | 'onScroll'
    | 'onMomentumScrollBegin'
    | 'onMomentumScrollEnd'
    | 'sections'
    | 'onEndReached'
    >

const styles = StyleSheet.create({
    sectionHeader: {
        width: 50,
        height: 50,
        marginTop: 18,
        marginLeft: 5,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todayHeader: {
        backgroundColor: DefaultColors.today
    },
    sectionToday: {
        ...material.captionWhiteObject,
        textTransform: 'uppercase'
    },
    sectionText: {
        ...material.captionObject,
        textTransform: 'uppercase'
    }
})

function AgendaList<T>(props: AgendaListProps<T>) {
    const renderSectionHeader = (
        info: { section: SectionListData<T> }
    ) => {
        const section = info.section as SectionListData<T> & { title: Date }
        const today = isToday(section.title)
        const day = getDay(section.title)
        const dayOfWeek = format(section.title, DateFormats.MONTH_WEEK_SHORT)

        return (
            <View style={ [
                styles.sectionHeader,
                today ? styles.todayHeader : {}
            ] }>
                <Text style={ today ? styles.sectionToday : styles.sectionText }>
                    { day }
                </Text>
                <Text style={ today ? styles.sectionToday : styles.sectionText }>
                    { dayOfWeek }
                </Text>
            </View>
        )
    }

    return (
        <SectionList
            stickySectionHeadersEnabled
            sections={ props.sections }
            renderItem={ props.renderItem }
            keyExtractor={ (_, index) => index + '' }
            showsVerticalScrollIndicator={ false }
            renderSectionHeader={ renderSectionHeader }
            onEndReached={ props.onEndReached }
        />
    )
}

export default AgendaList
