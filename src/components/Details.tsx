import * as React from 'react';
import { StyleSheet, Dimensions, View, Text, Image, ScrollView } from 'react-native';
const { VirtualizedList } = require('react-native');
import { connect } from 'react-redux';
import {
  NgcInfo,
  getObjectImgSrc,
  resolveTypes,
  resolveConstellation,
  dmsToString,
  CoordSeries,
  NightInfo,
  Az
} from 'astroffers-core';
import { getOpenedNgcInfoIndex, getList, getMinAltitude, getHorizontalCoords, getNightInfo } from '../selectors';
import { openDetails } from '../actions';
import { displayToDetails } from '../utils/display';
import AltitudeChart from './AltitudeChart';
import AzimuthChart from './AzimuthChart';

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  propertyLabeL: {
    fontWeight: 'bold',
    fontSize: 11
  },
  propertyValue: {
    fontSize: 12
  }
});

class Row extends React.PureComponent<{
  label1: string;
  value1: string | number;
  label2?: string;
  value2?: string | number;
}> {
  render() {
    const fontSize = 12;
    const { label1, label2, value1, value2 } = this.props;
    return (
      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.propertyLabeL}>{label1}</Text>
          <Text style={styles.propertyValue}>{value1}</Text>
        </View>
        {value2 && (
          <View style={{ flex: 1 }}>
            <Text style={styles.propertyLabeL}>{label2}</Text>
            <Text style={styles.propertyValue}>{value2}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default connect(
  state => ({
    initialIndex: getOpenedNgcInfoIndex(state),
    objects: getList(state),
    minAltitude: getMinAltitude(state),
    nightInfo: getNightInfo(state),
    horizontalCoords: getHorizontalCoords(state)
  }),
  { openDetails }
)(
  class extends React.PureComponent<{
    initialIndex: number;
    objects: NgcInfo[];
    minAltitude: number;
    horizontalCoords: CoordSeries<Az>;
    nightInfo: NightInfo;
    openDetails: typeof openDetails;
  }> {
    timer;

    state = {
      isAllowRenderCharts: false
    };

    componentDidMount() {
      this.initTimer();
    }

    handleSwipe = e => {
      const contentOffset = e.nativeEvent.contentOffset;
      const index = Math.round(contentOffset.x / WIDTH);
      if (index === this.props.initialIndex) return;
      this.props.openDetails(this.props.objects[index].object.ngc);
      this.initTimer();
    };

    initTimer() {
      if (this.timer) clearTimeout(this.timer);
      this.setState({ isAllowRenderCharts: false });
      this.timer = setTimeout(() => {
        this.setState({ isAllowRenderCharts: true });
      }, 250);
    }

    renderItem = ({ item: ngcInfo, index }) => {
      const {
        ngc,
        title,
        types,
        constellation,
        size,
        magnitude,
        surfaceBrightness,
        ra,
        de,
        raOnDate,
        deOnDate,
        rising,
        setting,
        risingAboveMinAltitude,
        settingBelowMinAltitude,
        from,
        to,
        max,
        altitudeAtMax,
        transit,
        altitudeAtTransit
      } = displayToDetails(ngcInfo);

      const { minAltitude, nightInfo, horizontalCoords, initialIndex } = this.props;
      const { isAllowRenderCharts } = this.state;

      return (
        <View style={{ flex: 1, width: WIDTH }}>
          <ScrollView>
            <Image source={{ uri: getObjectImgSrc(ngc) }} style={{ width: WIDTH, height: WIDTH }} />
            <View style={{ padding: 20 }}>
              <View>
                <Text style={{ fontSize: 20, color: 'black', maxWidth: '100%', marginBottom: 20 }}>{title}</Text>
              </View>
              <View>
                <Row
                  label1="Type"
                  value1={resolveTypes(types).join(', ')}
                  label2="Constellation"
                  value2={resolveConstellation(constellation)}
                />
                <Row label1="Magnitude" value1={magnitude} label2="Surface brightness" value2={surfaceBrightness} />
                <Row label1="Size" value1={size} />
                <Row label1="RA (J2000)" value1={ra} label2="Dec (J2000)" value2={de} />
                <Row label1="RA (on date)" value1={raOnDate} label2="Dec (on date)" value2={deOnDate} />
                <Row label1="Rising" value1={rising} label2="Setting" value2={setting} />
                <Row
                  label1={`Rising above ${minAltitude}°`}
                  value1={risingAboveMinAltitude}
                  label2={`Setting below ${minAltitude}°`}
                  value2={settingBelowMinAltitude}
                />
                <Row label1="Visibility from" value1={from} label2="Visibility to" value2={to} />
                <Row label1="Best visibility" value1={max} label2="Altitude" value2={altitudeAtMax} />
                <Row label1="Transit" value1={transit} label2="Altitude" value2={altitudeAtTransit} />
              </View>
            </View>
            <View style={{ height: 440 }}>
              {isAllowRenderCharts &&
              initialIndex === index && (
                <View style={{ marginBottom: 20 }}>
                  <AltitudeChart
                    minAltitude={minAltitude}
                    ngcInfo={ngcInfo}
                    horizontalCoords={horizontalCoords}
                    nightInfo={nightInfo}
                  />
                </View>
              )}
              {isAllowRenderCharts &&
              initialIndex === index && (
                <View style={{ marginBottom: 20, alignItems: 'center' }}>
                  <AzimuthChart horizontalCoords={horizontalCoords} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      );
    };

    render() {
      const { objects, initialIndex } = this.props;
      return (
        <VirtualizedList
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'white',
            elevation: 4
          }}
          horizontal
          pagingEnabled
          data={objects}
          windowSize={3}
          maxToRenderPerBatch={1}
          initialNumToRender={1}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => ({
            length: WIDTH,
            offset: WIDTH * index,
            index
          })}
          keyExtractor={(item, index) => index}
          getItemCount={data => data.length}
          getItem={(data, index) => data[index]}
          renderItem={this.renderItem}
          onMomentumScrollEnd={this.handleSwipe}
        />
      );
    }
  }
);
