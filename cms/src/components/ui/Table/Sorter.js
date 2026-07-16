import React from 'react'
import { useConfig } from '../ConfigProvider'
import { SortDownSvg, SortSvg, SortUpSvg } from 'assets/svg'

const Sorter = ({sort}) => {
	const { themeColor, primaryColorLevel } = useConfig()

	const color = `text-${themeColor}-${primaryColorLevel}`

	const renderSort = () => {
		if ( typeof sort !== 'boolean') {
			return <SortSvg />
		}
		return sort ? <SortDownSvg className={color} /> : <SortUpSvg className={color} />
	}

	return (
		<div className="inline-flex">
			{renderSort()}
		</div>
	)
}

export default Sorter
