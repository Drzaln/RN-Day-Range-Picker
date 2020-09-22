import React from 'react'
import { View, Text } from 'react-native'
import DateRange from './DateRange'

const App = () => {
	return (
		<View style={{ flex: 1 }}>
			<DateRange
				onSuccess={(s, e) => alert(s + '||' + e)}
				theme={{ markColor: 'red', markTextColor: 'white' }}
			/>
		</View>
	)
}

export default App
