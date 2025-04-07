import { useLocation } from 'react-router-dom'
import { format, parseISO, formatDistance } from 'date-fns'
import { enUS, nl, de , fr } from 'date-fns/locale'
import { useIntl } from 'react-intl';

const localeMap: Record<string, Locale> = {
  en: enUS,
  nl: nl,
  de: de,
  fr: fr
};

export const getURLQuery = (): URLSearchParams => {
  const location = useLocation()
  return new URLSearchParams(location.search)
}

export const getEntriesMessage = (count: number, single: string, plural: string, none: string): string => {
  if (count === 1) {
    return single
  } else if (count > 1) {
    return `${count} ${plural}`
  } else {
    return none
  }
}

export const formatDate = (
  date: string | Date,
  formatType: 'dateOnly' | 'default' = 'default',
  locale: string,
  customFormat?: string
) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(parsedDate.getTime())) return 'Invalid Date'

  const dateFormat = customFormat || (formatType === 'dateOnly' ? 'd MMM, Y' : "eeee, MMMM d, Y 'at' h:mm:ss aa")

  // Fallback to `enUS` if locale is not mapped
  const dateFnsLocale = localeMap[locale.split('-')[0]] || enUS;
  return format(parsedDate, dateFormat, { locale: dateFnsLocale })
}

export const filterDatesByRange = (value: any) => {
  return formatDistance(parseISO(value), new Date(), { addSuffix: true })
}
