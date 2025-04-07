import { Text, Email, Number, Date, Drag } from '@strapi/icons'
import Radio from './Icons/Radio'
import Checkbox from './Icons/Checkbox'
import Dropdown from './Icons/Dropdown'
import Print from './Icons/Print'

export const fieldIconGenerator = (type: String) => {
  switch (type) {
    case 'text':
      return <Text width="31px" height="23px" />
    case 'number':
      return <Number width="31px" height="23px" />
    case 'email':
      return <Email width="31px" height="23px" />
    case 'radio':
      return <Radio />
    case 'checkbox':
      return <Checkbox />
    case 'dropdown':
      return <Dropdown />
    case 'date':
      return <Date width="31px" height="23px" />
    case 'drag':
      return <Drag width="12px" height="12px" />
    case 'print':
      return <Print />
    default:
      return <Text width="31px" height="23px" />
  }
}
