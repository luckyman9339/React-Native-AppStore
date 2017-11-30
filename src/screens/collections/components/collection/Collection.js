import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { COLLECTION_SCREEN, pushAppScreen } from 'screens';
import AppItemRow from 'components/app-item-row';
import AppItemSlider from 'components/app-item-slider';
import AppItemFeatured from 'components/app-item-featured';
import AppItemLargeTile from 'components/app-item-large-tile';
import Heading from 'components/heading';
import CategoriesList from 'components/categories-list';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

export default class Collection extends PureComponent {

  static propTypes = {
    collection: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: undefined,
  }


  @autobind
  onAppPress(props) {
    const { navigator, type } = this.props;
    console.log('app', props);
    pushAppScreen({
      navigator,
      backTitle: type === 'APP' ? 'Apps' : 'Games',
      app: props,
    });
  }

  @autobind
  onSeeAllPress() {
    const { collection, navigator } = this.props;
    navigator.push({
      screen: COLLECTION_SCREEN,
      title: collection.title,
      passProps: {
        collection,
      },
    });
  }

  @autobind
  renderAppItem(item) {
    const { type } = this.props.collection;

    // Most likely will be AppItemRow
    let ComposedComponent = AppItemRow;

    // Setup props
    const props = {
      ...item,
      key: item.id,
      id: item.id,
      imageUrl: item.iconUrl,
      title: item.title,
      subtitle: item.subtitle,
      action: {
        label: item.price ? `$${item.price}` : 'GET',
        subtitle: item.hasInAppPurchases ? 'In-App Purchases' : undefined,
      },
      onPress: this.onAppPress,
    };

    if (type === 'FEATURED') {
      // Switch to Featured Component
      ComposedComponent = AppItemFeatured;
      props.legend = `NEW ${this.props.type}`;
    }

    if (type === 'LARGE_TILE') {
      // Switch to Large Tile Component
      ComposedComponent = AppItemLargeTile;
    }

    if (type === 'PROMO_TOP' || type === 'PROMO_BOTTOM') {
      props.legend = 'Interperet visions, solve mysteries';
      props.screenshotUrl = item.iconUrl;
    }

    return <ComposedComponent {...props} />;
  }

  render() {
    // Get needed props from collection
    const {
      id,
      apps = [],
      type,
      rows,
      title,
    } = this.props.collection;

    // Content of the collection section
    let content = (
      <AppItemSlider
        itemsPerPage={rows}
        condensed={type === 'LARGE_TILE'}
      >
        {apps.map(this.renderAppItem)}
      </AppItemSlider>
    );

    // TODO: Use a component `<TopApps type="APP|GAME" free size={16} />` here
    if (type === 'TOP_FREE') {
      return null;
    }

    // TODO: Use a component `<TopApps type="APP|GAME" paid size={16} />` here
    if (type === 'TOP_PAID') {
      return null;
    }

    if (type === 'TOP_CATEGORIES') {
      content = (<CategoriesList type={this.props.type} top={5} />);
    }

    // Show heading?
    const isHeadingShown = (type !== 'FEATURED');

    // Dont show empty collections
    if (apps.length === 0) {
      return null;
    }

    return (
      <View key={id}>
        {isHeadingShown && (
          <Heading action="See All" onActionPress={this.onSeeAllPress}>
            {title}
          </Heading>
        )}
        {content}
      </View>
    );
  }
}
