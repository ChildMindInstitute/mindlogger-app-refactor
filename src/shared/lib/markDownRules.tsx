import { StyleSheet, Dimensions, Linking, View } from 'react-native';

import { CachedImage, CacheManager } from '@georstat/react-native-image-cache';
import { format } from 'date-fns';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {
  ASTNode,
  RenderRules,
  renderRules as defaultRenderRules,
} from 'react-native-markdown-display';
// @ts-ignore
import * as mime from 'react-native-mime-types';
import sanitizeHtml from 'sanitize-html';

import {
  Box,
  Text,
  AudioPlayer,
  VideoPlayer,
  YoutubeVideo,
  XStack,
} from '@shared/ui';

import { colors } from './constants';

const { width: viewPortWidth } = Dimensions.get('window');
const PADDING_X = 32;

const localStyles = StyleSheet.create({
  alignLeftContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: viewPortWidth - 20,
    textAlign: 'left',
  },
  alignRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: viewPortWidth - 20,
    textAlign: 'right',
  },
  alignCenterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: viewPortWidth - 20,
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  text: {
    flexDirection: 'row',
  },
  markedText: {
    backgroundColor: 'yellow',
  },
  primaryText: {
    color: colors.primary,
  },
  image: {
    height: 200,
    width: viewPortWidth - 100,
  },
  htmlWebView: {
    width: Dimensions.get('window').width,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

const listItemStyles = {
  bullet_list_icon: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    alignSelf: 'center',
    width: 8,
  },
  ordered_list_icon: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    alignSelf: 'center',
  },
  _VIEW_SAFE_ordered_list_content: {
    marginLeft: 3,
  },
  _VIEW_SAFE_bullet_list_content: {
    marginLeft: 3,
  },
};

export const activityMarkDownStyles = StyleSheet.create({
  heading1: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading3: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading4: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading5: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading6: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  paragraph: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '300',
  },
  text: {
    flexDirection: 'row',
  },
  blockquote: {
    backgroundColor: colors.lighterGrey2,
    borderLeftWidth: 4,
    borderLeftColor: colors.mediumGrey,
    paddingVertical: 0,
    paddingHorizontal: 5,
    marginLeft: 3,
  },
  fence: {
    color: '#000',
  },
});

const videoStyles = {
  height: 250,
  width: '100%',
  backgroundColor: '#000',
};

const htmlBlockStyles = `
  * {
    font-size: 22px;
    font-weight: 300;
    text-align: center;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    margin-bottom: 18px;
    text-align: left;
  }

  h1 {
    font-size: 36px;
  }

  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 24px;
  }

  h4 {
    font-size: 20px;
  }

  h5 {
    font-size: 18px;
  }

  h6 {
    font-size: 16px;
  }

  p {
    text-align: center;
    font-size: 22px;
    font-weight: 300;
  }

  a {
    text-decoration: underline;
  }

  img {
    object-fit: contain;
    width: calc(100vw - 80px);
    margin: 0px 40px;
  }

  table {
    width: 100%;
    border: 1px solid;
    border-collapse: collapse;
  }

  tr {
    border-bottom: 1px solid black;
  }

  td {
    font-size: 14px;
    text-align: left;
  }
`;

const onHtmlBlockLinkPress = (request: { url: string }) => {
  if (request.url !== 'about:blank') {
    Linking.openURL(request.url);
    return false;
  }
  return true;
};

const AlignmentTags = [
  'container_hljs-left',
  'container_hljs-center',
  'container_hljs-right',
] as const;

type AlignmentTag = (typeof AlignmentTags)[number];

const AlignmentStyles = {
  'container_hljs-left': {
    textAlign: 'left',
  },
  'container_hljs-right': {
    textAlign: 'right',
  },
  'container_hljs-center': {
    textAlign: 'center',
  },
} as const satisfies Record<AlignmentTag, object>;

const markDownRules: RenderRules = {
  'container_hljs-left': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignLeftContainer} space={20}>
        {children}
      </Box>
    );
  },
  'container_hljs-center': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignCenterContainer} space={20}>
        {children}
      </Box>
    );
  },
  'container_hljs-right': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignRightContainer} space={20}>
        {children}
      </Box>
    );
  },
  // softbreak: (node, children, parents, styles) => {
  //   return (
  //     <View key={node.key} style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
  //       <Text style={{ width: '100%' }}>{"\n"}</Text>
  //     </View>
  //   );
  // },
  softbreak: (node, children, parents, styles) => {
    return (
      <View key={node.key} style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={{ width: '100%', backgroundColor:"blue" }}></Text>
      </View>
    );
  },
  
  
  table: (node, children) => {
    console.log("************************* table :", node)

    return (
      <Box
        key={node.key}
        borderColor="$lightGrey"
        borderTopWidth={0.5}
        borderLeftWidth={0.5}
        flex={1}
        width={viewPortWidth - PADDING_X}
      >
        {children}
      </Box>
    );
  },
  td: (node, children) => {
    console.log("************************* TD :", node)

    return (
      <Box
        key={node.key}
        borderBottomWidth={0.5}
        borderRightWidth={0.5}
        borderColor="$lightGrey"
        px={8}
        py={14}
        flex={1}
      >
        {children.map(child => (
          <Text textAlign="center">{child}</Text>
        ))}
      </Box>
    );
  },
  th: (node, children) => {
    console.log("************************* TH :", node)
    return (
      <Box
        key={node.key}
        px={8}
        py={14}
        borderColor="$lightGrey"
        borderBottomWidth={0.5}
        borderRightWidth={0.5}
        flex={1}
      >
        {children.map(child => (
          <Text textAlign="center" fontWeight="700">
            {child}
          </Text>
        ))}
      </Box>
    );
  },
  tr: (node, children) => {
    console.log("************************* TR :", node)

    return <XStack key={node.key}>{children}</XStack>;
  },
  code_inline: node => {
    console.log("\n\n\n GOT IN HERE code_inline *************************************", node, "********************* aaaa\n\n\n")

    return (
      <Text
        fontFamily="$code"
        fontSize={15}
        backgroundColor="$lighterGrey3"
        color="$codePink"
      >
        {node.content}
      </Text>
    );
  },
  text: (node, children, parents, styles, inheritedStyles = {}) => {
    // console.log("\n\n\n GOT IN HERE text *************************************", node, "********************* aaaa\n\n\n")

    const containerAlignTag = getContainerAlignTag(parents);

    let additionalStyles = {};
    let updatedNodeContent = node.content;

    if (node.content.startsWith('++') && node.content.endsWith('++')) {
      updatedNodeContent = node.content.replace(/[+]+/g, '');
      additionalStyles = localStyles.underline;
    }
    if (node.content.startsWith('==') && node.content.endsWith('==')) {
      updatedNodeContent = node.content.replace(/[=]=/g, '');
      additionalStyles = localStyles.markedText;
    }
    if (node.content?.includes('[blue]')) {
      additionalStyles = localStyles.primaryText;
      updatedNodeContent = node.content.replace('[blue]', '');
    }

    const todayDate = format(new Date(), 'MM/dd/yyyy');
    updatedNodeContent = updatedNodeContent
      .replace(/<([^‘]*[a-zA-Z]+[^‘]*)>/gi, '')
      .replace(/\[\[sys.date]]/i, todayDate);
    const [, , wrapperParent] = parents;

    if (wrapperParent?.type === 'list_item') {
      inheritedStyles = {
        ...inheritedStyles,
        ...localStyles.listItemText,
      };
    }

    if (containerAlignTag) {
      const alignmentStyles = AlignmentStyles[containerAlignTag];

      additionalStyles = {
        ...additionalStyles,
        ...alignmentStyles,
      };
    }

    return (
      <Text
        key={node.key}
        style={[
          inheritedStyles,
          styles.text,
          localStyles.text,
          { ...additionalStyles },
        ]}
      >
        {parseNodeContent(updatedNodeContent)}
      </Text>
    );
  },
  image: node => {
    const src = node.attributes?.src;

    // console.log("\n\n\n ******************", node )
    // const sizeMatch = src?.match(/(\d+x\d+)$/);
 
    const lastSlashIndex = src.lastIndexOf('/');
    const lastSegment = src.substring(lastSlashIndex + 1);

    console.log(`Last Segment: ${lastSegment}`);

    const xIndex = lastSegment?.indexOf('x');
    let width = null
    let height = null
    if (xIndex !== -1) {
        width = Number(lastSegment.slice(0, xIndex).replace(/\D/g, ''));
        height = Number(lastSegment.slice(xIndex + 1).replace(/\D/g, ''));
    } else {
        console.log("No size found");
    }
    // console.log("****** xIndex", xIndex, "width x height",width,"X",height, "\n\n\n SRC:",src)

    const mimeType = mime.lookup(src) || '';

    const isAudio = mimeType.startsWith('audio/');
    const isVideo =
      mimeType.startsWith('video/') || src?.includes('.quicktime');
    const isYoutubeVideo = src?.includes('youtu');

    if (isAudio) {
      return <AudioPlayer uri={src} title={node.content} key={node.key} />;
    } else if (isVideo) {
      return (
        <Box key={`${node.key}-wrapper`} {...videoStyles}>
          <VideoPlayer
            uri={src}
            key={node.key}
            thumbnailStyle={videoStyles}
            videoStyle={videoStyles}
            wrapperStyle={videoStyles}
          />
        </Box>
      );
    } else if (isYoutubeVideo) {
      return <YoutubeVideo key={node.key} src={src} />;
    }

    const isCached = !!CacheManager.entries[node.attributes.src];

    return (
      <CachedImage
        key={node.key}
        resizeMode="contain"
        // style={localStyles.image}
        style={{width: width && width < (viewPortWidth -100) ? width: (viewPortWidth -100) , height:height}}
        source={node.attributes.src}
        sourceAnimationDuration={isCached ? 0 : 200}
      />
    );
  },
  paragraph: (node, children, parents, styles) => {
    // console.log("************************* paragraph :", JSON.stringify(node))

    const customContainerTagExists = checkIfContainerTypeIsHljs(parents);

    if (customContainerTagExists) {
      return <Box key={node.key}>{children}</Box>;
    }

    // @ts-ignore
    return defaultRenderRules.paragraph(node, children, parents, styles);
  },
  html_inline: (node, children) => {
    console.log("************************* html_inline :", node)

    const isSafeTag = !!sanitizeHtml(node.content);

    return isSafeTag ? children : null;
  },
  html_block: node => {
    console.log("************************* html_block :", node)

    const htmlContent = sanitizeHtml(node.content);

    return (
      <AutoHeightWebView
        key={node.key}
        style={localStyles.htmlWebView}
        customStyle={htmlBlockStyles}
        source={{ html: htmlContent }}
        scrollEnabled={false}
        scalesPageToFit={false}
        allowsProtectedMedia
        mixedContentMode="always"
        viewportContent="width=device-width, user-scalable=no"
        onShouldStartLoadWithRequest={onHtmlBlockLinkPress}
        androidLayerType="hardware"
      />
    );
  },
  list_item: (node, children, parents, styles) => {
    console.log("\n\n\n GOT IN HERE list_item *************************************", node, "********************* aaaa\n\n\n")

    const customContainerTagExists = checkIfContainerTypeIsHljs(parents);

    return (
      <Box key={node.key} my={customContainerTagExists ? 3 : -6}>
        {
          // @ts-ignore
          defaultRenderRules.list_item(node, children, parents, {
            ...styles,
            ...listItemStyles,
          })
        }
      </Box>
    );
  },
};

const styleVariables = (content: string) => {
  // console.log("\n\n\n GOT IN HERE styleVariables *************************************", content, "********************* aaaa\n\n\n")
  
  const regex = /(\^.+?\^)|(~.+?~)|(==.+?==)|(\+\+.+?\+\+)/g;
  const highlightRegex = /[=]=.+?==/g;
  const underlineRegex = /\+\+.+?\+\+/g;
  const superscriptRegex = /\^.+?\^/g;
  const subscriptRegex = /~.+?~/g;

  const strings = content.split(regex).filter(Boolean);

  return strings.map((text, index) => {
    if (highlightRegex.test(text)) {
      return <Text backgroundColor="yellow">{text.replace(/[==^]/g, '')}</Text>;
    }

    if (underlineRegex.test(text)) {
      return (
        <Text textDecorationLine="underline">{text.replace(/[++^]/g, '')}</Text>
      );
    }

    if (superscriptRegex.test(text)) {
      return (
        <Box h={28} key={`subscript-${index}`}>
          <Text fontSize={13}>{text.replace(/\^/g, '')}</Text>
        </Box>
      );
    }

    if (subscriptRegex.test(text)) {
      return (
        <Box h={28} key={`subscript-${index}`}>
          <Text fontSize={13} mt={14}>
            {text.replace(/[~]/g, '')}
          </Text>
        </Box>
      );
    }

    return text;
  });
};

const parseNodeContent = (content: string) => {
  // console.log("\n\n\n GOT IN HERE parseNodeContent *************************************", content, "********************* aaaa\n\n\n")

  return styleVariables(content);
};

const checkIfContainerTypeIsHljs = (parents: ASTNode[]) => {
  for (const parent of parents) {
    const { type } = parent;
    // console.log("************************* HLJS",type, "---------",parent)
    if (type.includes('container_hljs')) {
      return true;
    }
  }

  return false;
};

const getContainerAlignTag = (parents: ASTNode[]): AlignmentTag | undefined => {
  // console.log("\n\n\n GOT IN HERE getContainerAlignTag *************************************", parents, "********************* aaaa\n\n\n")

  const tag = parents
    .map(parent => parent.type)
    .find((type): type is AlignmentTag =>
      (AlignmentTags as readonly string[]).includes(type),
    );

  return tag;
};

// export const preprocessImageLinks = (content: string) => {
//   // This will insert a double line break between consecutive images
//   return content
//     // .replace(/(!\[.*?\]\s*\(.*?\))(?=\s*!?\[)/g, '$1\n')
//     .replace(/(\!\[.*?\]\(.*?\))/g, '\n\n$1\n')
//     .replace(/\n{3,}/g, '\n') 
//     .replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2');
// };
// export const preprocessImageLinks = (content: string) => {
//   return content
//     // Ensure line breaks are only added where needed
//     .replace(/(\!\[.*?\]\(.*?\))/g, '$1\n')
//     // Clean up any excessive line breaks, leaving just one
//     .replace(/\n{3,}/g, '\n\n')
//     .replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2');
// };

export const preprocessImageLinks = (content: string) => {
  return content?.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2');
};




export default markDownRules;
