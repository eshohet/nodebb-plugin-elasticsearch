<h1><i class="fa fa-search"></i> Elasticsearch</h1>

<div class="row">
    <div class="col-sm-8" style="padding: 20px;">
        <h3>Client Configuration</h3>
        <form role="form" class="elasticsearch-settings">
            <div class="form-group">
                <label for="host">Host</label>
                <input class="form-control" value="{host}" type="text" name="host" id="host"
                       placeholder="Default: 127.0.0.1:9200"/>
            </div>

            <h4>Indexing Settings</h4>
            <div class="form-group">
                <label for="index_name">Index Name</label>
                <input class="form-control" value="{index}" type="text" name="index_name" id="index_name"
                       placeholder="Default: nodebb"/>
            </div>
            <div class="form-group">
                <label for="post_type">Post Type</label>
                <input class="form-control" value="{post_type}" type="text" name="post_type" id="post_type"
                       placeholder="Default: posts"/>
            </div>
            <div class="form-group">
                <label for="post_type">Batch Index Size</label>
                <input class="form-control" value="{batch_size}" type="text" name="batch_size" id="batch_size"
                       placeholder="Default: 1000"/>
            </div>
            <button id="save" type="button" class="btn btn-primary btn-block">Save</button>
        </form>
    </div>
    <div class="col-sm-4" style="padding:20px;">
        <h3>Advanced Options</h3>
        <button id="rebuild-index" class="btn btn-success">Rebuild Search Index</button>
        <p class="help-block">
            This option reads every topic and post saved in the database and adds it to the search index.
        </p>
    </div>
</div>
