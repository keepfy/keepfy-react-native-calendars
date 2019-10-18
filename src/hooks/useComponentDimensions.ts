import { useCallback, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

type Dimensions = {
    width: number
    height: number
}

const useComponentDimensions = (defaultSize: Dimensions) => {
    const [size, setSize] = useState(defaultSize)

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout

        if(size.height !== height || size.width !== width) {
            setSize({ width, height })
        }
    }, [size.height, size.width])

    return [size, onLayout] as const
}

export default useComponentDimensions
