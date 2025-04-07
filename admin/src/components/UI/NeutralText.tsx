import { Typography } from '@strapi/design-system'
import styled from 'styled-components'

const NeutralText = styled(Typography)`
  color: ${({ theme }) => theme.colors.neutral800};
`

export default NeutralText
