import { Box, Typography, Table, Thead, Tbody, Tr, Td, Th, Link } from '@strapi/design-system'
import { InfoDetailsOptional } from '../../types'
import { filterDatesByRange } from '../../utils/helpers'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import FormURLs from '../../utils/urls'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface Props {
  details: InfoDetailsOptional
}

const setInfo = (value: string, key: string) => {
  switch (key) {
    case 'Created':
    case 'Last updated':
      return filterDatesByRange(value)
    case 'Submitted on':
      // @Todo it will be corrected into PR-181
      return format(new Date(value), "eeee, MMMM d, Y 'at' h:m:s aa")
    default:
      return value
  }
}

const navigateTo = (formId: number) => {
  FormURLs.EDIT
  return FormURLs.EDIT(formId)
}

const commonTypographyStyles = {
  textColor: 'neutral600',
  style: { fontSize: '12px' },
}

const InfoBox: React.FC<Props> = ({ details }) => {
  const formatMessage = useFormatMessage()
  return (
    <Box width="100%">
      <Table>
        <Thead>
          <Tr>
            <Th colSpan="2" textAlign="center">
              <Typography fontWeight="bold" {...commonTypographyStyles}>
                {formatMessage('Information.Title', 'INFORMATION')}
              </Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(details).map((key) => (
            <Tr key={key}>
              <Td>
                <Typography fontWeight="bold" style={{ fontSize: '12px' }}>
                  {key}
                </Typography>
              </Td>
              {details[key as keyof typeof details] &&
                (key !== 'Form' ? (
                  <Td>
                    <Typography {...commonTypographyStyles}>
                      {setInfo(details[key as keyof typeof details] as string, key)}
                    </Typography>
                  </Td>
                ) : (
                  <Td>
                    <Typography {...commonTypographyStyles}>
                      <Link
                        as={NavLink}
                        to={navigateTo(details[key as keyof typeof details] as number)}
                        style={{ textDecoration: 'none' }}
                      >
                        {details[key as keyof typeof details]}
                      </Link>
                    </Typography>
                  </Td>
                ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default InfoBox
