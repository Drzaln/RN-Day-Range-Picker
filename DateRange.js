import React, { Component } from 'react'
import { CalendarList } from 'react-native-calendars'
import propTypes from 'prop-types'
import moment from 'moment'

class DateRange extends Component {
	state = { isFromDatePicked: false, isToDatePicked: false, markedDates: {} }

	componentDidMount() {
		this.setupInitialRange()
	}

	onDayPress = (day) => {
		if (!this.state.isFromDatePicked || (this.state.isFromDatePicked && this.state.isToDatePicked)) {
			this.setupStartMarker(day)
		} else if (!this.state.isToDatePicked) {
			let markedDates = { ...this.state.markedDates }
			let [ mMarkedDates, range ] = this.setupMarkedDates(this.state.fromDate, day.dateString, markedDates)
			if (range >= 0) {
				this.setState({ isFromDatePicked: true, isToDatePicked: true, markedDates: mMarkedDates })
				this.props.onSuccess(this.state.fromDate, day.dateString)
			} else {
				this.setupStartMarker(day)
			}
		}
	}

	setupStartMarker = (day) => {
		let markedDates = {
			[day.dateString]: {
				startingDay: true,
				color: this.props.theme.markColor,
				textColor: this.props.theme.markTextColor
			}
		}
		this.setState({
			isFromDatePicked: true,
			isToDatePicked: false,
			fromDate: day.dateString,
			markedDates: markedDates
		})
	}

	setupMarkedDates = (fromDate, toDate, markedDates) => {
		let mFromDate = new Date(fromDate)
		let mToDate = new Date(toDate)
		let diffTime = mToDate.getTime() - mFromDate.getTime()
		let range = diffTime / (1000 * 3600 * 24)
		if (range >= 0) {
			if (range == 0) {
				markedDates = {
					[toDate]: { color: this.props.theme.markColor, textColor: this.props.theme.markTextColor }
				}
			} else {
				for (var i = 1; i <= range; i++) {
					let raw = mFromDate.setDate(mFromDate.getDate() + 1)
					let tempDate = moment(raw).format('yyyy-MM-DD')
					if (i < range) {
						markedDates[tempDate] = {
							color: this.props.theme.markColor,
							textColor: this.props.theme.markTextColor
						}
					} else {
						markedDates[tempDate] = {
							endingDay: true,
							color: this.props.theme.markColor,
							textColor: this.props.theme.markTextColor
						}
					}
				}
			}
		}
		return [ markedDates, range ]
	}

	setupInitialRange = () => {
		if (!this.props.initialRange) return
		let [ fromDate, toDate ] = this.props.initialRange
		let markedDates = {
			[fromDate]: {
				startingDay: true,
				color: this.props.theme.markColor,
				textColor: this.props.theme.markTextColor
			}
		}
		let [ mMarkedDates, range ] = this.setupMarkedDates(fromDate, toDate, markedDates)
		this.setState({ markedDates: mMarkedDates, fromDate: fromDate })
	}

	render() {
		return (
			<CalendarList
				{...this.props}
				markingType={'period'}
				// current={this.state.fromDate}
				markedDates={this.state.markedDates}
				onDayPress={(day) => {
					this.onDayPress(day)
				}}
				scrollEnabled={true}
				showScrollIndicator={false}
			/>
		)
	}
}

DateRange.propTypes = {
	initialRange: propTypes.array,
	onSuccess: propTypes.func.isRequired
}

DateRange.defaultProps = {
	theme: { markColor: '#00adf5', markTextColor: '#ffffff' },
	initialRange: [ moment(new Date()).format('yyyy-MM-DD'), moment(new Date()).add(1, 'd').format('yyyy-MM-DD') ]
}

export default DateRange
