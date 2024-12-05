import {
	PluginDocumentSettingPanel,
} from '@wordpress/edit-post';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useDispatch } from '@wordpress/data';
import { TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function JetpackLocalAiPlugin() {
	const { editPost } = useDispatch( 'core/editor' );

	const { excerpt, postId } = useSelect( select => {
		const { getEditedPostAttribute, getCurrentPostId } = select( editorStore );

		return {
			excerpt: getEditedPostAttribute( 'excerpt' ) ?? '',
			postId: getCurrentPostId() ?? 0,
		};
	}, [] );

	const postContent = useSelect( select => {
		const content = select( editorStore ).getEditedPostContent();
		if ( ! content ) {
			return '';
		}

		const document = new window.DOMParser().parseFromString( content, 'text/html' );

		const documentRawText = document.body.textContent || document.body.innerText || '';

		// Keep only one break line (\n) between blocks.
		return documentRawText.replace( /\n{2,}/g, '\n' ).trim();
	}, [] );

	function generateExcerpt() {
		console.log( 'generateExcerpt' );
		console.log( postContent );
		editPost( { excerpt: 'potato' } );
	}

	return (
		<PluginDocumentSettingPanel
			name="jetpack-ai-excerpt"
			title="AI Excerpt"
		>
			<TextareaControl
				__nextHasNoMarginBottom
				label={ __( 'Write an excerpt (optional)', 'jetpack' ) }
				onChange={ value => editPost( { excerpt: value } ) }
				// help={ numberOfWords ? helpNumberOfWords : null }
				value={ excerpt }
				// disabled={ isTextAreaDisabled }
			/>
			<Button
				onClick={ generateExcerpt }
				variant="primary"
				// disabled={ requestingState !== 'done' || requireUpgrade }
			>
				{ __( 'Generate Excerpt with AI', 'jetpack' ) }
			</Button>
		</PluginDocumentSettingPanel>
	);
}
