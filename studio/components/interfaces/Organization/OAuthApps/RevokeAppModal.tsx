import { useParams } from 'common'
import { useAuthorizedAppRevokeMutation } from 'data/oauth/authorized-app-revoke-mutation'
import { AuthorizedApp } from 'data/oauth/authorized-apps-query'
import { useStore } from 'hooks'
import { Alert, Modal } from 'ui'

export interface RevokeAppModalProps {
  selectedApp?: AuthorizedApp
  onClose: () => void
}

const RevokeAppModal = ({ selectedApp, onClose }: RevokeAppModalProps) => {
  const { ui } = useStore()
  const { slug } = useParams()
  const { mutateAsync: revokeAuthorizedApp, isLoading: isDeleting } =
    useAuthorizedAppRevokeMutation()

  const onConfirmDelete = async () => {
    if (!slug) return console.error('Slug is required')
    if (!selectedApp?.id) return console.error('App ID is required')

    try {
      await revokeAuthorizedApp({ slug, id: selectedApp?.id })
      ui.setNotification({
        category: 'success',
        message: `Successfully revoked the app "${selectedApp?.name}"`,
      })
      onClose()
    } catch (error) {
      ui.setNotification({
        category: 'error',
        message: `Failed to revoke app: ${(error as any).message}`,
      })
    }
  }

  return (
    <Modal
      size="medium"
      alignFooter="right"
      header={`Confirm to revoke ${selectedApp?.name}`}
      visible={selectedApp !== undefined}
      loading={false} // [TO UPDATE]
      onCancel={onClose}
      onConfirm={onConfirmDelete}
    >
      <Modal.Content>
        <div className="py-4">
          <Alert withIcon variant="warning" title="This action cannot be undone">
            This application will no longer have access to your organization's settings and
            projects.
          </Alert>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default RevokeAppModal
