import { Button, Dialog, Portal } from 'react-native-paper'
import Calendar from '../calendar/Calendar'
import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { material } from 'react-native-typography'
import { EventEmitter } from 'fbemitter'
import DefaultColors from '../../lib/colors'
import format, { DateFormats } from '../../lib/format'

type Props = {
    visible: boolean
    onDismiss: () => void
}

const styles = StyleSheet.create({
    dialog: {
        paddingVertical: 12,
        marginHorizontal: 64
    },
    contentContainer: {
        paddingHorizontal: 24
    },
    dayTitle: {
        ...material.display1Object,
        fontWeight: '600',
        marginBottom: 30
    },
    yearTitle: {
        ...material.subheadingObject,
        fontWeight: '700'
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    actionText: {
        ...material.buttonObject,
        color: DefaultColors.pickerActionButtons,
        textTransform: 'none'
    }
})

const DatePickerModal = (props: Props) => {
    const emitter = useMemo(() => new EventEmitter<'onPress'>(), [])
    const currentDay = useMemo(() => new Date(), [])
    const [selectedDay, setSelectedDay] = useState(currentDay)
    const selectedFormats = useMemo(() => ({
        year: format(selectedDay, DateFormats.YEAR),
        currentLabel: format(
            selectedDay,
            DateFormats.WEEK_DAY_MONTH_DESCRIPTIVE
        )
    }), [selectedDay])
    useEffect(() => {
        const listener = emitter.addListener('onPress', (date: Date) => {
            setSelectedDay(date)
        })

        return () => {
            listener.remove()
        }
    }, [emitter])

    return (
        <Portal>
            <Dialog
                style={ styles.dialog }
                visible={ props.visible }
                onDismiss={ props.onDismiss }>
                <View style={ styles.contentContainer }>
                    <Text style={ styles.yearTitle }>
                        { selectedFormats.year }
                    </Text>
                    <Text style={ styles.dayTitle }>
                        { selectedFormats.currentLabel }
                    </Text>
                    <Calendar
                        showExtraDates={ false }
                        selectedDay={ selectedDay }
                        currentDay={ currentDay }
                        initialDate={ currentDay }
                        emitter={ emitter }
                    />
                </View>
                <View style={ styles.actionsContainer }>
                    <Button mode='text'>
                        <Text style={ styles.actionText }>
                            Cancelar
                        </Text>
                    </Button>
                    <Button mode='text'>
                        <Text style={ styles.actionText }>
                            OK
                        </Text>
                    </Button>
                </View>
            </Dialog>
        </Portal>
    )
}

export default DatePickerModal
