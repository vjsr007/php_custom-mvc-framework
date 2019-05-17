<?php

class Category extends Model {
		var $hasMany = array('Product' => 'Product');
		var $hasOne = array('Parent' => 'Category');

}