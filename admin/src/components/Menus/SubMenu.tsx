import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
  Box,
  Flex,
  SubNav,
  SubNavHeader,
  SubNavLink,
  SubNavLinkSection,
  SubNavSection,
  SubNavSections,
  TextButton,
} from '@strapi/design-system'
import { Envelop, Plus } from '@strapi/icons'
import { useHandleSelectChange } from '../../utils/paginationSelect'
import FormBuilder from '../Icons/FormBuilder'
import FormURLs from '../../utils/urls'
import useAddFormStore from '../../stores/addFormStore'
import { useFormatMessage } from '../../hooks/useFormatMessage'

interface MenuItem {
  id: number
  label: string
  icon: React.ReactNode
  to: string
  active?: boolean
  children?: MenuItem[]
}

const StyledTextButton = styled(TextButton).attrs({
  variant: 'secondary',
})`
  padding-left: 32px;
  outline: none;
  span {
    font-size: 0.875rem;
    line-height: 1.43;
  }
`
const SubMenu: React.FC = () => {
  const formatMessage = useFormatMessage()
  const { setShowModal } = useAddFormStore()
  const { handleSelectChange } = useHandleSelectChange()

  const links: MenuItem[] = [
    {
      id: 1,
      label: formatMessage('SubNav.Forms','Form'),
      icon: <FormBuilder />,
      to: FormURLs.LISTING_WITH_QUERY(),
    },
    {
      id: 2,
      label: formatMessage('SubNav.Submissions','Submissions'),
      icon: <Envelop />,
      to: FormURLs.SUBMISSIONS_LISTING_WITH_QUERY(),
    },
  ]

  return (
    <Flex
      className="subnav-container"
      style={{
        alignItems: 'flex-start',
      }}
    >
      <Box background="neutral200" height="100%">
        <SubNav ariaLabel="Plugin sub nav">
          <SubNavHeader
            searchable={false}
            id="1"
            label={formatMessage('SubNav.Dashboard', 'Dashboard')}
          />
          <SubNavSections>
            <SubNavSection>
              {links.map(
                (link) =>
                  link.icon &&
                  (link.children ? (
                    <SubNavLinkSection label={link.label} id={link.id} key={link.id} icon={link.icon}>
                      {link.children.map((child) => (
                        <SubNavLink
                          as={NavLink}
                          active={child.active}
                          to={child.to}
                          icon={child.icon}
                          key={child.id}
                          isSubSectionChild
                          onClick={() => handleSelectChange('10')}
                        >
                          {child.label}
                        </SubNavLink>
                      ))}
                    </SubNavLinkSection>
                  ) : (
                    <SubNavLink to={link.to} active={link.active} icon={link.icon} key={link.id}>
                      {link.label}
                    </SubNavLink>
                  ))
              )}
            </SubNavSection>
            <StyledTextButton startIcon={<Plus width={12} height={12} />} onClick={() => setShowModal(true)}>
              {formatMessage('SubNav.NewForm', 'New form')}
            </StyledTextButton>
          </SubNavSections>
        </SubNav>
      </Box>
    </Flex>
  )
}

export default SubMenu
