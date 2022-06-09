etUpdater().startCurrentVersionSync({
      allowObsoleteHost: true
    });
  } else {
    moduleUpdater.initPathsOnly(buildInfo);
