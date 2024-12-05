import {
	PluginDocumentSettingPanel,
} from '@wordpress/edit-post';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as editorStore } from '@wordpress/editor';
import { useDispatch } from '@wordpress/data';
import { TextareaControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function JetpackLocalAiPlugin() {
	const { editPost } = useDispatch( 'core/editor' );
	const [ isGenerating, setIsGenerating ] = useState( false );

	const { excerpt, title, postId } = useSelect( select => {
		const { getEditedPostAttribute, getCurrentPostId } = select( editorStore );

		return {
			excerpt: getEditedPostAttribute( 'excerpt' ) ?? '',
			title: getEditedPostAttribute( 'title' ) ?? '',
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

	function summarize() {
		return ai.summarizer.create( {
			type: "tl;dr",
			length: "short",
			sharedContext: `An article titled ${title}`,
		} )
		.then( summarizer => summarizer.summarize( postContent ) )
		.then( summary => {
			console.log( 'Summary generated:', summary );
			editPost( { excerpt: summary } );
			return Promise.resolve();
		} );
	}

	function generateExcerpt() {
		console.log( 'generateExcerpt', postContent );
		if( ! ai.summarizer ) {
			console.warn( 'No AI summarizer found. Check your flags.' );
			return;
		}
		ai.summarizer.capabilities().then( capabilities => {
			console.log( 'Summarizer capabilities', capabilities );
			if ( capabilities.available === 'readily' ) {
				setIsGenerating( true );
				summarize().finally( () => {
					setIsGenerating( false );
				} );
			} else {
				console.warn( 'AI summarizer not available.' );
			}
		} );
	}

	return (
		<PluginDocumentSettingPanel
			name="jetpack-ai-excerpt"
			title="AI Excerpt"
		>
			<TextareaControl
				label={ __( 'Write an excerpt (optional)', 'jetpack' ) }
				onChange={ value => editPost( { excerpt: value } ) }
				value={ excerpt }
				disabled={ isGenerating }
			/>
			<Button
				onClick={ generateExcerpt }
				variant="primary"
				disabled={ isGenerating }
			>
				{ __( 'Generate Excerpt with AI', 'jetpack' ) }
			</Button>
		</PluginDocumentSettingPanel>
	);
}
